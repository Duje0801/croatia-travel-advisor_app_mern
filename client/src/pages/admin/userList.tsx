import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import Pagination from "../../components/pagination/pagination";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import { IUser } from "../../interfaces/IUser";
import { BiSearchAlt2 } from "react-icons/bi";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/userList.css";

export default function UserList(): JSX.Element {
  const [users, setUsers] = useState<IUser[]>([]);
  const [usersNo, setUsersNo] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(``);

  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  //This page is available only if username is admin

  const fetchData = async (): Promise<void> => {
    if (!state.user?.token) return;
    else {
      axios
        .get(
          `https://croatia-travel-advisor-app-mern.onrender.com/api/user/userList/?page=${page}`,
          {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${state.user.token}`,
            },
          }
        )
        .then((res) => {
          setUsers(res.data.data);
          setUsersNo(res.data.quantity);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err?.response?.data?.error) {
            setError(`${err.response.data.error}`);
          } else {
            setError(`Can't get users, please try again later.`);
          }
          setPage(1);
          setIsLoading(false);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
    }
  };

  useEffect((): void => {
    fetchData();
  }, [page, state.user]);

  const handleSearch = (inputText: string): void => {
    //If the number of characters is zero, list is set to default
    if (inputText.length < 1) {
      setError(``);
      setPage(1);
      fetchData();
      return;
    }

    axios
      .get(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/userList/${inputText}/?page=1`,
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        setUsers(res.data.data);
        setUsersNo(res.data.quantity);
        setPage(1);
        setError(``);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else {
          setError(`Can't add new destination, please try again later.`);
        }
        setUsers([]);
        setUsersNo(0);
        setPage(1);
      });
  };

  const handleUserClick = (username: string): void => {
    navigate(`${routes.user}/${username}`);
  };

  const mappedUsers: JSX.Element[] =
    users &&
    users.map((userInfo: IUser, i) => {
      return (
        <tr onClick={() => handleUserClick(userInfo.username)} key={i}>
          <td>{userInfo.username}</td>
          <td>{userInfo.email}</td>
          <td>{userInfo.active ? `Yes` : `No`}</td>
        </tr>
      );
    });

  if (state.user?.username !== `admin`)
    return <Redirect message={`Only admin have access to this page`} />;
  else if (isLoading) return <Loading />;
  else
    return (
      <div>
        <Navigation />
        <div className="userListTitle">User list:</div>
        <div className="userListError">{error}</div>
        <div className="userListSearchBar">
          <form>
            <div className="userListSearchBarIcon">
              <BiSearchAlt2 />
            </div>
            <input
              type="text"
              placeholder="Search user..."
              maxLength={10}
              onChange={(e) => handleSearch(e.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>
        </div>
        <table className="userListTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{mappedUsers}</tbody>
        </table>
        <div className="userListExplanation">
          For profile details click on username, email or active status
        </div>
        <Pagination
          totalLength={usersNo}
          itemsPerPage={10}
          page={page}
          setPage={setPage}
        />
      </div>
    );
}
