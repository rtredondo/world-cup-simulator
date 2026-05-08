function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('wc2026_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 10) +
                Math.random().toString(36).substring(2, 10);
    localStorage.setItem('wc2026_session_id', sessionId);
  }
  return sessionId;
}

export async function logSimulation(data) {
  console.log('logSimulation called with:', data);
  try {
    const sessionId = getOrCreateSessionId();
    const payload = {
      data: {
        Timestamp: new Date().toISOString(),
        Session_ID: sessionId,
        Champion: data.champion || '',
        Runner_up: data.runnerUp || '',
        SF1: data.sf1 || '',
        SF2: data.sf2 || '',
        '1A': data.groups?.A || '',
        '1B': data.groups?.B || '',
        '1C': data.groups?.C || '',
        '1D': data.groups?.D || '',
        '1E': data.groups?.E || '',
        '1F': data.groups?.F || '',
        '1G': data.groups?.G || '',
        '1H': data.groups?.H || '',
        '1I': data.groups?.I || '',
        '1J': data.groups?.J || '',
        '1K': data.groups?.K || '',
        '1L': data.groups?.L || ''
      }
    };

    console.log('Sending payload to SheetDB:', payload);
    const response = await fetch('https://sheetdb.io/api/v1/2gdpftjjcwczk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log('SheetDB response:', result);
  } catch (e) {
    console.log('Error in logSimulation:', e);
    // Fail silently — never interrupt the user experience
  }
}
