import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();

  // The current index of the slideshow
  const [index, setIndex] = useState(0);

  // Sorted list of data.focus by month
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    // Corrected: invert this so slides are displayed from the oldest to the newest
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

  // This function call the next slide after a timeout
  const nextCard = () => {
    // Corrected: add a condition to be sure to have sorted data before going to next slide
    if (!byDateDesc) {
      console.log("No data yet ?")
      return;
    }
    setTimeout(
      // Corrected: add - 1 after byDateDesc.length to correctly compare with index
      () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
      5000
    );
  };
  
  // This useEffect is called each time 'index' change,
  // so each time a slide change it calls the next slide change
  useEffect(() => {
    nextCard();
  });

  return (
    <div className="SlideCardList">
      {/* Slide */}
      {byDateDesc?.map((event, idx) => (
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
            >
            
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
      ))}

      {/* Pagination */}
      {/* Corrected: move the pagination out of the slides .map() */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((_, radioIdx) => (
            <input
              // todo: find another way to create an unique key here, 'cause the test returns an error 
              // key={crypto.randomUUID()}
              
              // eslint-disable-next-line react/no-array-index-key
              key={radioIdx + 10}
              type="radio"
              name="radio-button"
              // Corrected: compare with the current index so it knows if its checked
              checked={radioIdx === index}
              readOnly
            />
          ))}          
        </div>
      </div>

    </div>
  );
};

export default Slider;
