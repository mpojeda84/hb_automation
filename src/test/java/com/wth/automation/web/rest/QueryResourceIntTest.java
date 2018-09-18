package com.wth.automation.web.rest;

import com.wth.automation.AutomationApp;

import com.wth.automation.domain.Query;
import com.wth.automation.repository.QueryRepository;
import com.wth.automation.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;


import static com.wth.automation.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the QueryResource REST controller.
 *
 * @see QueryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AutomationApp.class)
public class QueryResourceIntTest {

    private static final String DEFAULT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String DEFAULT_ENV = "AAAAAAAAAA";
    private static final String UPDATED_ENV = "BBBBBBBBBB";

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restQueryMockMvc;

    private Query query;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QueryResource queryResource = new QueryResource(queryRepository);
        this.restQueryMockMvc = MockMvcBuilders.standaloneSetup(queryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Query createEntity() {
        Query query = new Query()
            .key(DEFAULT_KEY)
            .value(DEFAULT_VALUE)
            .env(DEFAULT_ENV);
        return query;
    }

    @Before
    public void initTest() {
        queryRepository.deleteAll();
        query = createEntity();
    }

    @Test
    public void createQuery() throws Exception {
        int databaseSizeBeforeCreate = queryRepository.findAll().size();

        // Create the Query
        restQueryMockMvc.perform(post("/api/queries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isCreated());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeCreate + 1);
        Query testQuery = queryList.get(queryList.size() - 1);
        assertThat(testQuery.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testQuery.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testQuery.getEnv()).isEqualTo(DEFAULT_ENV);
    }

    @Test
    public void createQueryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = queryRepository.findAll().size();

        // Create the Query with an existing ID
        query.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restQueryMockMvc.perform(post("/api/queries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllQueries() throws Exception {
        // Initialize the database
        queryRepository.save(query);

        // Get all the queryList
        restQueryMockMvc.perform(get("/api/queries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(query.getId())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())))
            .andExpect(jsonPath("$.[*].env").value(hasItem(DEFAULT_ENV.toString())));
    }
    
    @Test
    public void getQuery() throws Exception {
        // Initialize the database
        queryRepository.save(query);

        // Get the query
        restQueryMockMvc.perform(get("/api/queries/{id}", query.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(query.getId()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()))
            .andExpect(jsonPath("$.env").value(DEFAULT_ENV.toString()));
    }

    @Test
    public void getNonExistingQuery() throws Exception {
        // Get the query
        restQueryMockMvc.perform(get("/api/queries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateQuery() throws Exception {
        // Initialize the database
        queryRepository.save(query);

        int databaseSizeBeforeUpdate = queryRepository.findAll().size();

        // Update the query
        Query updatedQuery = queryRepository.findById(query.getId()).get();
        updatedQuery
            .key(UPDATED_KEY)
            .value(UPDATED_VALUE)
            .env(UPDATED_ENV);

        restQueryMockMvc.perform(put("/api/queries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuery)))
            .andExpect(status().isOk());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
        Query testQuery = queryList.get(queryList.size() - 1);
        assertThat(testQuery.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testQuery.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testQuery.getEnv()).isEqualTo(UPDATED_ENV);
    }

    @Test
    public void updateNonExistingQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();

        // Create the Query

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQueryMockMvc.perform(put("/api/queries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deleteQuery() throws Exception {
        // Initialize the database
        queryRepository.save(query);

        int databaseSizeBeforeDelete = queryRepository.findAll().size();

        // Get the query
        restQueryMockMvc.perform(delete("/api/queries/{id}", query.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Query.class);
        Query query1 = new Query();
        query1.setId("id1");
        Query query2 = new Query();
        query2.setId(query1.getId());
        assertThat(query1).isEqualTo(query2);
        query2.setId("id2");
        assertThat(query1).isNotEqualTo(query2);
        query1.setId(null);
        assertThat(query1).isNotEqualTo(query2);
    }
}
