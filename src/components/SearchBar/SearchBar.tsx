import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const handleFormAction = (formData: FormData, onSubmit: (query: string) => void) => {
    const query = (formData.get('query') as string).trim(); 

    if (!query) {
      toast.error('Please enter your search query.');
      return;
    }
    
    onSubmit(query);
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  
  const actionWithProps = (formData: FormData) => {
      handleFormAction(formData, onSubmit);
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={css.form} action={actionWithProps}> 
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;

