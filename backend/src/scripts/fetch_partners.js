const fetchPartners = async () => {
    try {
        const res = await fetch('http://localhost:5001/api/delivery/debug-partners');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching partners:', error);
    }
};

fetchPartners();
