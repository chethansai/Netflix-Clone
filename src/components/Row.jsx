import { useState, useEffect } from 'react';
import Movie from './Movie';
import axios from 'axios';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Row = ({ title, fetchURL, rowID }) => {
  //States local to Component
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(fetchURL).then((response) => {
      console.log('ok');
      console.log(response.data.results);
      setMovies(response.data.results);
    });
  }, [fetchURL]);

  const slideLeft = () => {
    const scroller = document.getElementById('slider' + rowID);

    // You can adjust the scrollLeft value to control the scrolling distance.
    // For example, scroll 200 pixels to the left:
    scroller.scrollLeft -= 200;
  };

  const slideRight = () => {
    const scroller = document.getElementById('slider' + rowID);

    // You can adjust the scrollLeft value to control the scrolling distance.
    // For example, scroll 200 pixels to the left:
    scroller.scrollRight += 200;
  };
  return (
    // {movies.map(movie)=>{
    //     console.log(movie);
    // }}
    <div>
      <h1 className='text-gray-500'>{title}</h1>
      <div className='relative flex items-center group'>
        <MdChevronLeft
          onClick={slideLeft}
          className='bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
          size={40}
        />
        <div
          id={'slider' + rowID}
          className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'
        >
          {movies.map((item, id) => (
            <Movie item={item} key={id}></Movie>
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className='right-0 bg-white rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
          size={40}
        />
      </div>
    </div>
  );
};

export default Row;
