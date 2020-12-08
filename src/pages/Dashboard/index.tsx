import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { FiTrash } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logogithub.svg';

import { Title, Form, Repositorys, Error } from './styles';
import Repository from '../Repository';

interface Repository {
  id: number;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  language: string;
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setIntputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@Github Compare:repositories',
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@Github Compare:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setIntputError('Enter the author/name of the repository');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([repository, ...repositories]);
      setNewRepo('');
      setIntputError('');
    } catch (err) {
      setIntputError('Repository does not exist');
    }
  }

  const handleDeleteRepository = useCallback(repository_name => {
    const filteredRepositories = repositories.filter(
      repository => repository.id !== repository_name,
    );
    setRepositories(filteredRepositories);
  }, []);

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositories on Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          // eslint-disable-next-line prettier/prettier
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Enter the name of the repository"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositorys>
        {repositories.map(repository => (
          <div key={repository.full_name}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
              <p>{repository.language}</p>
            </div>

            <button
              type="submit"
              onClick={function () {
                return handleDeleteRepository(repository.id);
              }}
            >
              <FiTrash size={20} />
            </button>
          </div>
        ))}
      </Repositorys>
    </>
  );
};

export default Dashboard;
