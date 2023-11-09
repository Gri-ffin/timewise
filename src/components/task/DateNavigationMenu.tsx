import Link from 'next/link'

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../ui/navigation-menu"
import { Button } from '~/components/ui/button'
import type { Period } from '~/utils/task/types'

interface NavigationItem {
  name: string,
  period: Period
}

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
          <NavigationMenuItem key={navigationItem.period} onClick={() => changePeriod(navigationItem.period)}>
            <Button className={`${navigationItem.period === period && 'bg-gray-600 text-white hover:text-black'}`}>
              {navigationItem.name}
            </Button>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default DateNavigationMenu
