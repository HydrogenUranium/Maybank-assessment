package com.positive.dhl.core.helpers;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CSVHelpers {
    public static final String COMMA = ",";
    public static final String CRLF = "\r\n";

    /**
     *
     */
    public static String BuildFromResultSet(String[] keys, ResultSet results) throws SQLException {
        return CSVHelpers.BuildFromResultSet(keys, results, CSVHelpers.COMMA);
    }

    /**
     *
     */
    public static String BuildFromResultSet(String[] keys, ResultSet results, String delimiter) throws SQLException {
        StringBuilder output = new StringBuilder();
        for (String key: keys) {
            output.append(results.getString(key));
            output.append(delimiter);
        }
        return output.length() > 0 ? output.substring(0, output.length() - 1): "";
    }

    /**
     *
     */
    public static String Join(String[] values) {
        return CSVHelpers.Join(values, CSVHelpers.COMMA);
    }

    /**
     *
     */
    public static String Join(String[] values, String delimiter) {
        StringBuilder output = new StringBuilder();
        for (String string : values) {
            output.append(string);
            output.append(delimiter);
        }
        return output.length() > 0 ? output.substring(0, output.length() - 1): "";
    }
}
