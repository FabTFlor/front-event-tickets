import React, { useState, useEffect } from "react";
import "./PageEvents.css";

const mockEvents = {
  ncode: 1,
  events: [
    {
      date: "2025-07-15T20:00:00",
      eventId: 3,
      venue: {
        name: "Teatro Caupolican",
        location: "San Diego 850",
      },
      eventInfo:
        "TWICE, el aclamado grupo femenino de K-Pop, llega con su gira mundial 2025.",
      totalTicketsSold: 0,
      imageUrl: "https://i.ytimg.com/vi/o1YmEEnagLk/maxresdefault.jpg",
      name: "TWICE en vivo 2025",
      status: "ACTIVE",
    },
    {
      date: "2025-09-25T22:00:00",
      eventId: 9,
      venue: {
        name: "Teatro Caupolican",
        location: "San Diego 850",
      },
      eventInfo:
        "The Weeknd regresa con su gira 'After Hours World Tour 2025'.",
      totalTicketsSold: 0,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/5e/The_Weeknd_Performing_in_2017.jpg",
      name: "The Weeknd - After Hours World Tour 2025",
      status: "PENDING",
    },
  ],
};

const PageEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(mockEvents.events);
  }, []);

  return (
    <div className="events-page">
      <h1 className="page-title">Eventos</h1>
      <div className="events-container">
        {events.map((event) => (
          <div key={event.eventId} className="event-card">
            <img src={event.imageUrl} alt={event.name} className="event-image" />
            <div className="event-details">
              <h2 className="event-title">{event.name}</h2>
              <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
              <p className="event-location">{event.venue.name}</p>
              <p className="event-status">{event.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageEvents;
