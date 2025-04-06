package com.dhl.discover.junitUtils;

@FunctionalInterface
public interface ThrowableSupplier<T> {
    T get() throws Throwable;
}
