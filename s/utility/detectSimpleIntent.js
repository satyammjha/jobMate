const detectSimpleIntent = (query) => {
    query = query.toLowerCase();

    const locationPattern = /(in|at|from)\s+([a-zA-Z\s]+)/;
    const salaryPattern = /(\d+)(lpa|lacs|lakhs)/;
    const platformPattern = /(naukri|glassdoor|linkedin|indeed)/;


    const locationMatch = query.match(locationPattern);
    const location = locationMatch ? locationMatch[2].trim() : null;


    const salaryMatch = query.match(salaryPattern);
    const minSalary = salaryMatch ? parseInt(salaryMatch[1]) * 100000 : null;


    const platformMatch = query.match(platformPattern);
    const platform = platformMatch ? platformMatch[1].trim() : null;


    if (query.includes("show me jobs") || query.includes("find jobs")) {
        return {
            intent: "SHOW_JOBS",
            parameters: { location, platform, minSalary }
        };
    }

    if (query.includes("save jobs")) {
        return {
            intent: "SAVE_JOBS",
            parameters: { location, platform, minSalary }
        };
    }


    if (query.includes("enable notifications") || query.includes("turn on alerts")) {
        return { intent: "ENABLE_NOTIFICATIONS" };
    }
    if (query.includes("disable notifications") || query.includes("turn off alerts")) {
        return { intent: "DISABLE_NOTIFICATIONS" };
    }

    return { intent: "UNKNOWN" };
};

export {  detectSimpleIntent };