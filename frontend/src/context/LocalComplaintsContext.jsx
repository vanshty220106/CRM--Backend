import React, { createContext, useContext, useState, useEffect } from 'react';

const LocalComplaintsContext = createContext();

export const useLocalComplaints = () => useContext(LocalComplaintsContext);

export const LocalComplaintsProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('complaints');
    if (saved) {
      try {
        setComplaints(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse local complaints');
        setComplaints([]);
      }
    } else {
      setComplaints([]);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'initiated',
      updates: [
        {
          status: 'initiated',
          message: 'Complaint submitted successfully.',
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      ...complaint
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id, newStatus, message, proofImage = null) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updated = {
          ...c,
          status: newStatus,
          updates: [...c.updates, { status: newStatus, message, timestamp: Date.now() }]
        };
        if (proofImage && newStatus === 'resolved') {
          updated.proofImage = proofImage;
        }
        return updated;
      }
      return c;
    }));
  };

  const addFeedback = (id, message) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          feedback: {
            message,
            submittedAt: Date.now()
          }
        };
      }
      return c;
    }));
  };

  const getComplaintsByEmail = (email) => complaints.filter(c => c.userEmail === email);

  return (
    <LocalComplaintsContext.Provider value={{
      complaints,
      addComplaint,
      updateComplaintStatus,
      addFeedback,
      getComplaintsByEmail
    }}>
      {children}
    </LocalComplaintsContext.Provider>
  );
};
