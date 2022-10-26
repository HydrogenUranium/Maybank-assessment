package com.positive.dhl.core.shipnow.services;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import com.positive.dhl.core.shipnow.models.ValidationType;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.*;

public class CompetitionService {

    private CompetitionService(){
        throw new IllegalStateException("Not meant to be instantiated");
    }


    private static final Logger log = LoggerFactory.getLogger(CompetitionService.class);

    /**
     *
     */
    public static ValidatedRequestEntry prepareFromRequest(SlingHttpServletRequest request) {
        ValidatedRequestEntry entry = new ValidatedRequestEntry();
        entry.addRequiredField("email", request, ValidationType.EMAIL);
        entry.addRequiredField("firstname", request, ValidationType.NOT_EMPTY);
        entry.addRequiredField("lastname", request, ValidationType.NOT_EMPTY);
        entry.addRequiredField("path", request, ValidationType.NOT_EMPTY);

        String[] optionalFields = new String[] { "position", "contact", "size", "sector", "answer", "answer2", "answer3", "answer4", "answer5" };
        for (String optionalField : optionalFields) {
            entry.addOptionalField(optionalField, request);
        }

        return entry;
    }
    /**
     *
     */
    public static Boolean register(DataSourcePool dataSourcePool, ValidatedRequestEntry entry) {
        boolean output = false;

        try {
            DataSource dataSource = (DataSource)dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);

            try (Connection connection = dataSource.getConnection()) {
                try (PreparedStatement statement = connection.prepareStatement("INSERT INTO `competitions` (`competitionpath`, `firstname`, `lastname`, `email`, `position`, `contact`, `sector`, `size`, `answer`, `answer2`, `answer3`, `answer4`, `answer5`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
                    String[] keys = new String[]{"path", "firstname", "lastname", "email", "position", "contact", "size", "sector", "answer", "answer2", "answer3", "answer4", "answer5"};
                    for (int i = 0; i < keys.length; i++) {
                        statement.setString((i + 1), entry.get(keys[i]).toString());
                    }

                    statement.executeUpdate();
                }
            }
            output = true;

        } catch (DataSourceNotFoundException | SQLException ex) {
            log.error("An error occurred attempting register", ex);
        }

        return output;
    }
}
