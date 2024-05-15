import './App.css';
import { useQuery, gql } from '@apollo/client';

//write your query using gql
//copy paste the query from apollo server
const query = gql`
  query GetTodosWithUser {
    getTodos {
      title
      completed
      id
    }
  }
`;




function App() {
  //data r loading ashe, data holo actual api data r loading hocche jotokn data fetch hocche na
  const {data,loading,error} = useQuery(query)

  if(loading)
    return <h1>Loading...</h1>
  if(error)
    return <h1>Error Ocurred</h1> 

  return (
    <>
      <div>
        {/* {JSON.stringify(data)} */}
        {/* mapping the data  on UI */}
        <table>
          <tbody>
            {data?.getTodos?.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.complete}</td>
              </tr>
            ))}
              
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
