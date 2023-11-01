import Link from 'next/link'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu"

const navigationItems = [
  { name: 'Day', path: '/' },
  { name: 'Week', path: '/week' },
  { name: 'Month', path: '/month' },
  { name: 'Year', path: '/year' },
]

const DateNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map(navigationItem => (
          <NavigationMenuItem>
            <Link href={`/dashboard${navigationItem.path}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {navigationItem.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default DateNavigationMenu
