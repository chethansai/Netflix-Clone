import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';

import Movie from './Movie';
const SavedShows = () => {
  // Context Access [useAuth hook] :- Bring required
  // i) States for consuming values,
  // ii) Functions to Modify States in AuthContext
  const { db, user } = useAuth();

  //States local to Component
  const [movies, setMovies] = useState([]);

  const slideLeft = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  useEffect(() => {
    onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
      setMovies(doc.data()?.savedShows);
    });
  }, [user?.email]);

  const movieRef = doc(db, 'users', `${user?.email}`);

  const deleteShow = async (passedID) => {
    try {
      const result = movies.filter((item) => item.id !== passedID);
      await updateDoc(movieRef, {
        savedShows: result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className='text-white font-bold md:text-xl p-4'>sa</h2>
      <div className='relative flex items-center group'>
        <div className='relative flex items-center group'>
          <div
            id={'slider'}
            className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'
          >
            {movies.map((item) => (
              <div
                key={item.id}
                className='relative w-[160px] p-2 sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer'
              >
                <img
                  className='w-full h-auto block'
                  src={`https://image.tmdb.org/t/p/w500/${item?.img}`}
                  alt={item?.title}
                />
                <div className='absolute top-0 left-0 w-full h-full text-white hover:bg-black/80 opacity-0 hover:opacity-100 '>
                  <p className='white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>
                    {item?.title}
                  </p>
                  <p
                    onClick={() => deleteShow(item.id)}
                    className='absolute text-gray-300 top-4 right-4'
                  >
                    <AiOutlineClose></AiOutlineClose>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SavedShows;
