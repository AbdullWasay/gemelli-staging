

// import Heading from '@/components/ui/Heading/Heading'
import React from 'react'
import CampaignImpressionTend from './CampaignImpressionTend'
import PerformenceDistribution from './PerformenceDistribution'
import CompainsOverview from './CompainsOverview'
import CampaignsPerformance from './CampaignsPerformance'

const AdvertisingComponent = () => {
  return (
    <div>
        
        <PerformenceDistribution/>

        <CampaignImpressionTend/>

        <CompainsOverview/>

        <CampaignsPerformance/>


    </div>
  )
}

export default AdvertisingComponent