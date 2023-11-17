import Link from 'next/link'

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../ui/navigation-menu"
import { Button } from '~/components/ui/button'
import type { Period } from '~/utils/task/types'

interface NavigationItem {
  name: string,
  period: Period
}

// the period to show on the index page of the tasks which the user can switch between them to see his tasks
// for example if period === week then show the tasks for that week
const navigationItems: NavigationItem[] = [
  { name: 'Day', period: 'day' },
  { name: 'Week', period: 'week' },
  { name: 'Month', period: 'month' },
  { name: 'Year', period: 'year' },
]

const DateNavigationMenu = ({ changePeriod, period }: { changePeriod: (period: Period) => void, period: Period }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map(navigationItem => (
          // on click of the button switch the period and tasks to display
          // also change the background of the button to hint to the user the current period
          <NavigationMenuItem key={navigationItem.period} onClick={() => changePeriod(navigationItem.period)}>
            <Button variant='outline' className={`${navigationItem.period === period && 'bg-gray-600 text-white hover:text-black'}`}>
              {navigationItem.name}
            </Button>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default DateNavigationMenu
