import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Movie = ({ item }) => {
  const { db, user } = useAuth();

  //States local to Component
  const [saved, setSaved] = useState(false);
  const [like, setLike] = useState(false);

  const movieID = doc(db, 'users', `${user?.email}`);
  const saveShow = async () => {
    if (user?.email) {
      setLike(!like);
      setSaved(true);
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      });
    } else {
      alert('Please log in to save a movie');
    }
  };
  return (
    <div className='w-[10px] sm:w-[200px] md:w-[240px] lg:w-[280px] cursor-pointer relative inline-block'>
      <div className=' flex items-center justify-center '>
        <img
          src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
          className=' w-full h-auto block'
        ></img>
      </div>
      <div className='hover:bg-black opacity-0 hover:opacity-50  inset-0  flex items-center justify-center absolute'>
        <p className='text-gray-200 '>{item.title}</p>
      </div>
      <p onClick={saveShow}>
        {like ? (
          <FaHeart className='absolute top-4 left-4 text-gray-300' />
        ) : (
          <FaRegHeart className='absolute top-4 left-4 text-gray-300' />
        )}
      </p>
    </div>
  );
};

export default Movie;
