import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  CheckIcon,
  HomeIcon,
} from '@radix-ui/react-icons'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'Pending',
    label: 'Pending',
    icon: ClockIcon,
  },
  {
    value: 'Confirmed',
    label: 'Confirmed',
    icon: CheckIcon,
  },
  {
    value: 'Shipped',
    label: 'Shipped',
    icon: CheckCircledIcon,
  },
  {
    value: 'Delivered',
    label: 'Delivered',
    icon: HomeIcon,
  },

  {
    value: 'canceled',
    label: 'Canceled',
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
]
