import { api } from "~/utils/api"
import Group from "./Group"

const Groups = () => {
  const groupsQuery = api.group.getAllWithTasks.useQuery()

  return (
    <div className="my-5">
      {groupsQuery.isLoading ?
        <div className="flex flex-col items-center justify-center mt-44">
          <p className="text-xl">Loading. . .</p>
        </div> :
        <div className="space-y-4 mt-5 divide-y">
          {groupsQuery.data!.length > 0 ? groupsQuery.data?.map(group => {
            return (
              <Group data={group} key={group.id} />
            )
          }) : <div className="mt-10 font-semibold text-center text-xl">You don't have any tasks.</div>}
        </div>
      }
    </div>
  )
}

export default Groups
