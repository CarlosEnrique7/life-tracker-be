\echo 'Delete and recreate fitness_tracker db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE fitness_tracker;
CREATE DATABASE fitness_tracker;
\connect fitness_tracker

\i fitness-tracker-schema.sql


\echo 'Delete and recreate fitness_tracker_test db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE fitness_tracker_test;
CREATE DATABASE fitness_tracker_test;
\connect fitness_tracker_test

\i fitness-tracker-schema.sql
