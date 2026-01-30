package com.soluquim.mvpmultitenant.config.multitenancy;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String currentTenant = TenantContext.getCurrentTenant();
        
        if (currentTenant == null || currentTenant.isEmpty()) {
            String tenantId = request.getHeader("X-Tenant-ID");
            
            if (tenantId != null && !tenantId.isEmpty()) {
                TenantContext.setCurrentTenant(tenantId);
            } else {
                TenantContext.setCurrentTenant("public");
            }
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContext.clear();
    }
}
