import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import Pagination from "../../components/pagination/pagination";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/userList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [usersNo, setUsersNo] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  //This page is available only if username is admin

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      else {
        axios
          .get(`http://localhost:4000/api/user/userList/?page=${page}`, {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          })
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
            setIsLoading(false);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          });
      }
    };
    fetchData();
  }, [page, user]);

  const handleUserClick = (username) => {
    navigate(`${routes.user}/${username}`);
  };

  const mappedUsers =
    users &&
    users.map((userInfo, i) => {
      return (
        <tr onClick={() => handleUserClick(userInfo.username)} key={i}>
          <td>{userInfo.username}</td>
          <td>{userInfo.email}</td>
          <td>{userInfo.active ? `Yes` : `No`}</td>
        </tr>
      );
    });

  if (user?.username !== `admin`)
    return <Redirect message={`Only admin have access to this page`} />;
  else if (isLoading) return <Loading />;
  else
    return (
      <div>
        <Navigation />
        <div className="userListTitle">User list:</div>
        <div className="userListError">{error}</div>
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
