import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Settings, Users, ChevronRight, FileText, TestTubeDiagonal, SwatchBook, Wallet, BarChart3, Calendar, Database, ClipboardList, Shield, FlaskConical } from 'lucide-react'
import clsx from 'clsx'

const navData = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    to: '/dashboard',
  },
  {
    id: 'samples',
    label: 'Samples',
    icon: SwatchBook,
    children: [
      { id: 'sample-registration', label: 'Sample Registration', icon: ClipboardList, to: '/samples/register' },
      { id: 'sample-tracking', label: 'Sample Tracking', icon: Database, to: '/samples/tracking' },
      { id: 'sample-storage', label: 'Sample Storage', icon: FlaskConical, to: '/samples/storage' },
    ],
  },
  {
    id: 'tests',
    label: 'Tests & Analysis',
    icon: TestTubeDiagonal,
    children: [
      { id: 'test-methods', label: 'Test Methods', icon: FileText, to: '/tests/methods' },
      { id: 'test-queue', label: 'Test Queue', icon: Calendar, to: '/tests/queue' },
      { id: 'lab-equipment', label: 'Equipment', icon: Settings, to: '/tests/equipment' },
    ],
  },
  {
    id: 'results',
    label: 'Results',
    icon: BarChart3,
    children: [
      { id: 'test-results', label: 'Test Results', icon: FileText, to: '/results/tests' },
      { id: 'reports', label: 'Reports', icon: ClipboardList, to: '/results/reports' },
      { id: 'data-export', label: 'Data Export', icon: Database, to: '/results/export' },
    ],
  },
  {
    id: 'quality',
    label: 'Quality Control',
    icon: Shield,
    children: [
      { id: 'calibration', label: 'Calibration', icon: Settings, to: '/quality/calibration' },
      { id: 'validation', label: 'Validation', icon: TestTubeDiagonal, to: '/quality/validation' },
      { id: 'audit-trail', label: 'Audit Trail', icon: FileText, to: '/quality/audit' },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    to: '/users',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: Wallet,
    to: '/billing',
  }
]

export default function VerticalNav({ initialCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  function toggleGroup(id: string) {
    setOpenGroup((cur) => (cur === id ? null : id))
  }

  return (
    <aside
      className={clsx(
        'flex flex-col bg-white border-r border-gray-200 h-screen shadow-sm transition-all duration-300 ease-in-out',
        collapsed 
          ? 'w-16 sm:w-20 lg:w-28 xl:w-32' 
          : 'w-64 sm:w-80 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem]'
      )}
      aria-label="Primary navigation"
    >
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 sm:py-6 lg:py-8">
        <ul className="px-2 sm:px-3 lg:px-6 space-y-1 sm:space-y-2 lg:space-y-3 transform-gpu">
          <li>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-full flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-3 sm:py-4 lg:py-5 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-left transition-all duration-200"
            >
              <motion.div
                initial={false}
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-gray-600 transform-gpu"
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10" />
              </motion.div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 overflow-hidden whitespace-nowrap"
                  >
                    Mini LIMS
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </li>

          <li className="py-1">
            <div className="border-t border-gray-200"></div>
          </li>
          
          {navData.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleGroup(item.id)}
                    className="w-full flex items-center gap-2 sm:gap-4 lg:gap-5 px-2 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-5 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-left transition-all duration-200"
                    aria-expanded={openGroup === item.id}
                  >
                    <item.icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-gray-600 transition-all duration-300 flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="flex-1 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-700 transition-all duration-300 overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ rotate: openGroup === item.id ? 0 : -90, opacity: 0 }}
                          animate={{ rotate: openGroup === item.id ? 90 : 0, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="text-gray-500"
                        >
                          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  <AnimatePresence>
                    {openGroup === item.id && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-10 sm:pl-12 lg:pl-16 mt-3 space-y-2 overflow-hidden whitespace-nowrap"
                      >
                        {item.children.map((c) => (
                          <li key={c.id}>
                            <a
                              href={c.to}
                              className="flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 rounded-lg hover:bg-gray-100 text-xs sm:text-base lg:text-xl xl:text-2xl text-gray-600 hover:text-gray-800 transition-all duration-300"
                            >
                              <c.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 transition-all duration-300 flex-shrink-0" />
                              <span className="transition-all duration-300">{c.label}</span>
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  href={item.to}
                  className="flex items-center gap-2 sm:gap-4 lg:gap-5 px-2 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-5 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                >
                  <item.icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-gray-600 transition-all duration-300 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-semibold text-gray-700 transition-all duration-300"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 space-y-1 sm:space-y-2 lg:space-y-3">
        <button className="w-full flex items-center gap-2 sm:gap-4 lg:gap-5 px-2 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200">
          <Settings className="w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-gray-600 transition-all duration-300 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-700 transition-all duration-300 overflow-hidden whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4 lg:py-5 border-t border-gray-200 bg-gray-50">
        <button className="w-full flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 rounded-lg hover:bg-gray-200 transition-all duration-200">
          <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-xl lg:text-3xl xl:text-4xl flex-shrink-0">HD</div>
          <div className="flex-1 text-left">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="text-xs sm:text-base lg:text-xl xl:text-2xl transition-all duration-300 overflow-hidden whitespace-nowrap"
                >
                  <div className="font-bold text-gray-900">Harmonie D.</div>
                  <div className="text-xs sm:text-sm lg:text-lg xl:text-xl text-gray-500">Student</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
    </aside>
  )
}