import { api } from "~/utils/api";
import Task from "./Task";

const Tasks = ({ startDateFilter, finishDateFilter }: { startDateFilter: Date, finishDateFilter: Date }) => {

  // we fetch the tasks based on the interval of the dates from db
  const tasks = api.task.getTasks.useQuery({ startDateFilter: startDateFilter, finishDateFilter: finishDateFilter });

  return (
    <>
      {tasks.isLoading ?
        <div className="flex flex-col items-center justify-center mt-44">
          <p className="text-xl">Loading. . .</p>
        </div> :
        <div className="space-y-4 mt-5 divide-y">
          {tasks.data!.length > 0 ? tasks.data?.map(task => {
            return (
              <Task data={task} key={task.id} />
            )
          }) : <div className="mt-10 font-semibold text-center text-xl">You don't have any tasks.</div>}
        </div>
      }
    </>
  )
}

export default Tasks
