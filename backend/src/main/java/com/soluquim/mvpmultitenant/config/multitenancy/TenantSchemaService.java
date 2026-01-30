package com.soluquim.mvpmultitenant.config.multitenancy;

import liquibase.Contexts;
import liquibase.LabelExpression;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.resource.ClassLoaderResourceAccessor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;

@Service
@RequiredArgsConstructor
public class TenantSchemaService {

    private final DataSource dataSource;

    public void runUpdateOnSchema(String schemaName) {
        try (Connection connection = dataSource.getConnection()) {
            connection.setSchema(schemaName);

            Database database = DatabaseFactory.getInstance()
                    .findCorrectDatabaseImplementation(new JdbcConnection(connection));
            database.setDefaultSchemaName(schemaName);
            database.setLiquibaseSchemaName(schemaName);

            Liquibase liquibase = new Liquibase("db/changelog/db.changelog-tenant.xml",
                    new ClassLoaderResourceAccessor(), database);

            liquibase.update(new Contexts(), new LabelExpression());
        } catch (Exception e) {
            throw new RuntimeException("Error ejecutando Liquibase en el esquema: " + schemaName, e);
        }
    }
}
