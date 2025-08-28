import { MontserratFont, popinsFont } from '@/app/fonts'
import Button from '@/components/button'
import Card from '@/components/card'
import React from 'react'

const QuickActions = () => {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className={`text-xl font-bold text-gray-900 ${MontserratFont.className}`}>
            Quick Actions
          </h2>
          <p className={`text-gray-600 mt-1 ${popinsFont['400'].className}`}>
            Common tasks to help you manage your properties efficiently
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">
            Add Property
          </Button>
          <Button variant="secondary">
            Schedule Meeting
          </Button>
          <Button variant="secondary">
            Generate Report
          </Button>
          <Button variant="secondary">
            Import Data
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default QuickActions