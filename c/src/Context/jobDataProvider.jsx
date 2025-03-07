import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetchJobs = async () => {
    const response = await axios.get('http://43.205.114.6:5000/data/fetchJobsData');
    const { naukriJobs = [], gdJobs = [] } = response.data;
    return [...naukriJobs, ...gdJobs];
};

const JobDataContext = createContext();
export const JobDataProvider = ({ children }) => {
    const { data: jobs, error, isLoading } = useSWR('jobsData', fetchJobs, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

    return (
        <JobDataContext.Provider value={{
            jobs: jobs || [], 
            error,
            isLoading
        }}>
            {children}
        </JobDataContext.Provider>
    );
};
export const useJobData = () => useContext(JobDataContext);