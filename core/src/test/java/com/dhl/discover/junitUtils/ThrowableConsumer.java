package com.dhl.discover.junitUtils;


@FunctionalInterface
public interface ThrowableConsumer<T> {
    void accept(T t) throws Throwable;
}
