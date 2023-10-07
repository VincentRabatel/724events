import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = (
    (!type
      ? data?.events
      : data?.events) || []

  // Corrected: add a condition, the event must have the same type as the current active filter
  ).filter((event, index) => {
    // If there is still room on the page
    if ((currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index) {

      // If there is an active category filter
      if (type) {
        // If the event match the active category filter
        if(event.type === type) {
          return true;
        }
      } else {
        return true
      }
    }
    return false;
  });


  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Number of pages needed to show all events
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1; // console.log("Number of pages needed to show all events", pageNumber)

  // The full list of events' types from data
  const typeList = new Set(data?.events.map((event) => event.type)); // console.log("A full list of events' types", typeList)


  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          {/* Title */}
          <h3 className="SelectTitle">Catégories</h3>

          {/* Filter selection */}
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (
              value ? changeType(value) : changeType(null))}
          />

          {/* Event cards */}
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          {/* Pagination */}
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
          
        </>
      )}
    </>
  );
};

export default EventList;
