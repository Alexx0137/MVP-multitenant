package com.soluquim.mvpmultitenant.config.multitenancy;

import lombok.RequiredArgsConstructor;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class TenantConfig implements BeanPostProcessor {

    private final MultiTenantConnectionProvider<String> connectionProvider;
    private final CurrentTenantIdentifierResolver<String> tenantResolver;

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof LocalContainerEntityManagerFactoryBean) {
            LocalContainerEntityManagerFactoryBean factory = (LocalContainerEntityManagerFactoryBean) bean;

            Map<String, Object> jpaProperties = new HashMap<>();
            jpaProperties.put(AvailableSettings.MULTI_TENANT_CONNECTION_PROVIDER, connectionProvider);
            jpaProperties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, tenantResolver);

            factory.setJpaPropertyMap(jpaProperties);
        }
        return bean;
    }
}