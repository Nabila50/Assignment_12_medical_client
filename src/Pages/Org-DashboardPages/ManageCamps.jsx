import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const ManageCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const email = user?.email;

  // Fetch camps of logged-in organizer
  const { data: camps = [], refetch } = useQuery({
    queryKey: ["my-camps", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/addCamps/token?email=${email}`);
      return res.data;
    },
  });

  // ---------------- DELETE A CAMP ----------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This camp will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/delete-camp/${id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.deletedCount) {
            Swal.fire({
              title: "Deleted!",
              text: "Camp has been deleted!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
 
          }
          refetch();
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete camp.", "error");
      }
    }
  };

  // ---------------- UPDATE A CAMP ----------------
  // const handleUpdate = (id) => {
  //   Swal.fire({
  //     title: "Update Feature Coming!",
  //     text: "You can navigate to update page or open a modal.",
  //     icon: "info",
  //   });

    

const handleUpdate = (id) => {
  navigate(`/orgDashboard/update-camp/${id}`);
};

    // Example navigation if you have update page
    // navigate(`/dashboard/update-camp/${id}`);
  
  // if (isLoading) return <p>Loading camps...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-[#00bcd5]">
        Manage Your Camps
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Camp Name</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Healthcare Professional</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {camps.map((camp, index) => (
              <tr key={camp._id}>
                <td>{index + 1}</td>
                <td>{camp.campName}</td>
                <td>{camp.dateTime}</td>
                <td>{camp.location}</td>
                <td>{camp.healthcareProfessional}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleUpdate(camp._id)}
                    className="btn btn-sm btn-info"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(camp._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {camps.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-5">
                  No camps found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCamps;
