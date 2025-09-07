<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Models\BlogPost;

class BlogSeeder extends Seeder
{
  public function run()
  {
    // Create Categories
    $categories = [
      [
        'name' => 'Market Insights',
        'description' => 'Latest trends and insights from Dubai real estate market',
        'color' => '#eca820',
        'sort_order' => 1
      ],
      [
        'name' => 'Business Development',
        'description' => 'Business growth strategies and development tips',
        'color' => '#10b981',
        'sort_order' => 2
      ],
      [
        'name' => 'Career Development',
        'description' => 'Professional growth in real estate industry',
        'color' => '#3b82f6',
        'sort_order' => 3
      ],
      [
        'name' => 'Market Analysis',
        'description' => 'In-depth analysis of property market trends',
        'color' => '#8b5cf6',
        'sort_order' => 4
      ],
      [
        'name' => 'Investment Guide',
        'description' => 'Investment opportunities and guidance',
        'color' => '#ef4444',
        'sort_order' => 5
      ],
      [
        'name' => 'Sustainability',
        'description' => 'Sustainable practices in real estate',
        'color' => '#22c55e',
        'sort_order' => 6
      ]
    ];

    foreach ($categories as $category) {
      BlogCategory::create($category);
    }

    // Create Tags
    $tags = [
      'Dubai Real Estate',
      'Property Investment',
      'Market Trends',
      'UAE Business',
      'Growth Strategy',
      'Real Estate Career',
      'Professional Growth',
      'Dubai Market',
      '2025 Predictions',
      'Investment Tips',
      'Market Analysis',
      'Property Buying',
      'Luxury Homes',
      'Commercial Properties',
      'Off-Plan Properties',
      'Green Buildings',
      'Sustainable Development',
      'Future Trends',
      'Downtown Dubai',
      'Dubai Marina',
      'Business Bay',
      'DIFC',
      'Palm Jumeirah',
      'Emirates Hills'
    ];

    foreach ($tags as $tagName) {
      BlogTag::create(['name' => $tagName]);
    }

    // Create Sample Blog Posts
    $posts = [
      [
        'title' => 'Why Tailored Real Estate Solutions Are Changing the Way People Buy in Dubai',
        'excerpt' => 'In Dubai\'s fast-moving real estate market, finding the right property can feel overwhelming. With thousands of listings, endless neighborhoods, and varying price points, buyers often find themselves scrolling through homes that don\'t match their needs.',
        'content' => $this->getSampleContent1(),
        'author_id' => 1,
        'category_id' => 1,
        'status' => 'published',
        'is_featured' => true,
        'published_at' => now()->subDays(5),
        'views_count' => 1247,
        'seo_title' => 'Tailored Real Estate Solutions in Dubai | DNA Properties Hub',
        'seo_description' => 'Discover how personalized real estate solutions are transforming property buying in Dubai. Learn about modern approaches that match buyers with their perfect homes.',
        'seo_keywords' => ['Dubai Real Estate', 'Property Investment', 'Personalized Service', 'Real Estate Technology']
      ],
      [
        'title' => 'Grow Smarter, Faster, and Stronger in the UAE Market',
        'excerpt' => 'Dubai is one of the fastest-growing business hubs in the world — and for good reason. With tax benefits, global connectivity, and a strong economy, it offers a powerful platform for business success.',
        'content' => $this->getSampleContent2(),
        'author_id' => 1,
        'category_id' => 2,
        'status' => 'published',
        'is_featured' => true,
        'published_at' => now()->subDays(10),
        'views_count' => 892,
        'seo_title' => 'Business Growth Strategies in UAE Market 2024',
        'seo_description' => 'Learn effective strategies to grow your business in the UAE market. Expert tips for success in Dubai\'s dynamic economy.',
        'seo_keywords' => ['UAE Business', 'Growth Strategy', 'Dubai Economy', 'Business Development']
      ],
      [
        'title' => 'The Future of Sustainable Real Estate in Dubai',
        'excerpt' => 'As environmental consciousness grows globally, Dubai\'s real estate sector is embracing sustainable practices. From green buildings to eco-friendly communities.',
        'content' => $this->getSampleContent3(),
        'author_id' => 1,
        'category_id' => 6,
        'status' => 'draft',
        'is_featured' => false,
        'views_count' => 0,
        'seo_title' => 'Sustainable Real Estate Development in Dubai',
        'seo_description' => 'Explore the future of sustainable real estate in Dubai. Green buildings, eco-friendly communities, and environmental initiatives.',
        'seo_keywords' => ['Green Buildings', 'Sustainable Development', 'Dubai Environment', 'Eco-friendly']
      ],
      [
        'title' => 'Investment Opportunities in Dubai\'s Off-Plan Properties',
        'excerpt' => 'Off-plan properties continue to attract investors looking for competitive prices and flexible payment plans in Dubai\'s dynamic real estate market.',
        'content' => $this->getSampleContent4(),
        'author_id' => 1,
        'category_id' => 5,
        'status' => 'published',
        'is_featured' => false,
        'published_at' => now()->subDays(15),
        'views_count' => 654,
        'seo_title' => 'Dubai Off-Plan Property Investment Guide 2024',
        'seo_description' => 'Complete guide to investing in Dubai off-plan properties. Payment plans, ROI analysis, and market opportunities.',
        'seo_keywords' => ['Off-Plan Properties', 'Property Investment', 'Dubai Real Estate', 'Investment Guide']
      ]
    ];

    foreach ($posts as $postData) {
      $post = BlogPost::create($postData);

      // Attach random tags to each post
      $randomTags = BlogTag::inRandomOrder()->limit(rand(3, 6))->pluck('id');
      $post->tags()->attach($randomTags);
    }
  }

  private function getSampleContent1()
  {
    return "# Introduction

    In Dubai's fast-moving real estate market, finding the right property can feel overwhelming. With thousands of listings, endless neighborhoods, and varying price points, buyers often find themselves scrolling through homes that don't match their needs — or worse, missing out on the perfect one.

    That's where tailored real estate solutions come in. Rather than presenting clients with generic property lists, forward-thinking agencies are now offering personalized services that match individual lifestyles, budgets, and long-term goals.

    ## The Personal Touch Makes All the Difference

    Traditional real estate approaches often treat every buyer the same way. But today's successful agencies understand that a young professional looking for a studio apartment in Downtown Dubai has completely different needs than a growing family searching for a villa in Arabian Ranches.

    > \"We don't just sell properties; we match people with their perfect lifestyle. Every client gets a completely customized experience based on their unique requirements.\" - Sarah Ahmed, Senior Real Estate Consultant

    This personalized approach includes:

    - **Lifestyle Analysis:** Understanding how clients live, work, and spend their free time
    - **Budget Optimization:** Finding properties that offer the best value within specific price ranges
    - **Future-Proofing:** Considering long-term needs like family expansion or investment potential
    - **Community Matching:** Connecting buyers with neighborhoods that align with their values and interests

    ## Technology Meets Human Expertise

    Modern real estate agencies are leveraging advanced technology to enhance their personalized services. AI-powered matching algorithms can quickly identify properties that meet specific criteria, while virtual reality tours allow clients to explore homes remotely.

    However, technology is only as good as the human expertise behind it. The most successful agencies combine cutting-edge tools with experienced professionals who understand the nuances of Dubai's diverse neighborhoods and communities.

    ## The Results Speak for Themselves

    Clients who work with agencies offering tailored solutions report significantly higher satisfaction rates. They spend less time viewing unsuitable properties and more time making informed decisions about their future homes.

    In a market as dynamic as Dubai's, this personalized approach isn't just a luxury—it's becoming a necessity. As the city continues to grow and evolve, buyers need partners who can navigate the complexity and help them find not just a property, but their perfect home.

    The future of real estate in Dubai is personal, and the agencies that embrace this shift are the ones helping their clients achieve their dreams.";
  }

  private function getSampleContent2()
  {
    return "# Growing Your Business in the UAE Market

    Dubai is one of the fastest-growing business hubs in the world — and for good reason. With tax benefits, global connectivity, and a strong economy, it offers a powerful platform for business success. But to stand out, you need more than just a great idea — you need strategy.

    ## 10 Quick Tips for Business Success in Dubai

    ### 1. Understand the Local Market
    Research is crucial. Dubai's market is diverse, with customers from over 200 nationalities. Understanding cultural nuances and preferences can give you a significant competitive advantage.

    ### 2. Leverage Dubai's Strategic Location
    Use Dubai's position as a gateway between East and West. The city's connectivity makes it an ideal base for businesses looking to expand across the Middle East, Africa, and Asia.

    ### 3. Build Strong Local Partnerships
    Networking is essential in Dubai. Building relationships with local businesses, government entities, and industry leaders can open doors to new opportunities.

    ### 4. Embrace Digital Transformation
    Dubai is at the forefront of digital innovation. Businesses that embrace technology and digital solutions are better positioned for growth.

    ### 5. Focus on Quality and Service
    In a competitive market like Dubai, quality and exceptional service are differentiators that can set your business apart from the competition.

    ### 6. Understand Regulatory Requirements
    Stay compliant with UAE regulations and licensing requirements. This includes understanding free zone regulations if applicable to your business.

    ### 7. Invest in Talent Development
    Dubai attracts top talent from around the world. Investing in your team's development and creating an attractive work environment is crucial for retaining skilled employees.

    ### 8. Utilize Government Support Programs
    The UAE government offers various support programs for businesses, including funding, mentorship, and incubation programs.

    ### 9. Plan for Scalability
    Design your business model with growth in mind. Dubai's dynamic market offers numerous opportunities for expansion.

    ### 10. Stay Agile and Adaptable
    The business landscape in Dubai evolves quickly. Companies that can adapt to change and pivot when necessary are more likely to succeed.

    ## Conclusion

    Success in Dubai's market requires a combination of strategic planning, local knowledge, and adaptability. By following these guidelines and staying focused on delivering value, businesses can thrive in this dynamic environment.";
  }

  private function getSampleContent3()
  {
    return "# The Future of Sustainable Real Estate in Dubai

    As environmental consciousness grows globally, Dubai's real estate sector is embracing sustainable practices. From green buildings to eco-friendly communities, discover how sustainability is shaping the future of property development in the UAE.

    ## Dubai's Green Vision

    Dubai has set ambitious goals for sustainability, including the Dubai Clean Energy Strategy 2050, which aims to make Dubai the city with the lowest carbon footprint in the world by 2050.

    ### Key Sustainability Initiatives

    - **Green Building Regulations:** Mandatory green building standards for new developments
    - **Solar Energy Integration:** Widespread adoption of solar power systems
    - **Water Conservation:** Advanced water recycling and conservation systems
    - **Waste Reduction:** Comprehensive waste management and recycling programs

    ## Sustainable Development Trends

    ### 1. LEED and BREEAM Certified Buildings
    More developers are pursuing international green building certifications to meet environmental standards and attract environmentally conscious buyers.

    ### 2. Smart Home Technology
    Integration of IoT devices and smart systems that optimize energy consumption and reduce environmental impact.

    ### 3. Sustainable Materials
    Use of eco-friendly building materials and construction methods that minimize environmental impact.

    ### 4. Green Communities
    Development of entire neighborhoods designed around sustainability principles, including green spaces, renewable energy, and sustainable transportation.

    ## Benefits of Sustainable Real Estate

    - **Lower Operating Costs:** Reduced energy and water consumption
    - **Higher Property Values:** Premium pricing for sustainable properties
    - **Better Health and Wellness:** Improved indoor air quality and natural lighting
    - **Environmental Impact:** Reduced carbon footprint and resource consumption

    ## The Investment Perspective

    Sustainable properties are increasingly attractive to investors due to:
    - Higher rental yields
    - Lower vacancy rates
    - Government incentives
    - Future-proofing against environmental regulations

    ## Conclusion

    The future of Dubai's real estate market is undeniably green. As sustainability becomes a priority for both developers and buyers, we can expect to see continued innovation in eco-friendly building practices and technologies.";
  }

  private function getSampleContent4()
  {
    return "# Investment Opportunities in Dubai's Off-Plan Properties

    Off-plan properties continue to attract investors looking for competitive prices and flexible payment plans in Dubai's dynamic real estate market. Here's your comprehensive guide to off-plan investments in 2024.

    ## What Are Off-Plan Properties?

    Off-plan properties are real estate units sold before construction is completed. Buyers purchase based on architectural plans, renderings, and show units.

    ## Advantages of Off-Plan Investments

    ### 1. Competitive Pricing
    Off-plan properties are typically priced 15-30% below market value of completed properties.

    ### 2. Flexible Payment Plans
    Most developers offer attractive payment plans:
    - 10% down payment
    - 70% during construction
    - 20% on completion

    ### 3. Capital Appreciation Potential
    Properties often appreciate in value from purchase to completion.

    ### 4. Modern Specifications
    New developments feature the latest designs, technology, and amenities.

    ## Key Considerations

    ### Location Analysis
    - **Emerging Areas:** Higher growth potential but more risk
    - **Established Areas:** Lower risk but potentially lower returns
    - **Infrastructure Development:** Proximity to metro, schools, shopping

    ### Developer Reputation
    Research the developer's track record:
    - Previous project completions
    - Financial stability
    - Quality of construction
    - Delivery timelines

    ### Market Timing
    Understanding market cycles is crucial for maximizing returns.

    ## Popular Off-Plan Areas in Dubai

    1. **Dubai South:** Major infrastructure development around Al Maktoum Airport
    2. **Mohammed Bin Rashid City:** Large-scale mixed-use development
    3. **Dubai Hills Estate:** Premium community with golf course
    4. **Downtown Dubai:** Continued expansion with new towers
    5. **Dubai Marina:** Ongoing development in prime waterfront location

    ## Investment Strategy Tips

    ### Diversification
    Don't put all investments in one project or area.

    ### Due Diligence
    - Review all legal documents
    - Understand the payment schedule
    - Verify developer credentials
    - Check RERA registration

    ### Exit Strategy
    Plan your exit strategy:
    - Hold for rental income
    - Sell upon completion
    - Flip during construction

    ## Risks to Consider

    - **Construction delays**
    - **Market fluctuations**
    - **Developer financial issues**
    - **Changes in regulations**

    ## ROI Expectations

    Historical data shows off-plan properties in Dubai can generate:
    - 8-12% annual rental yields
    - 15-25% capital appreciation over 3-5 years

    ## Conclusion

    Off-plan properties offer attractive investment opportunities in Dubai, but success requires careful research, proper due diligence, and strategic planning. Work with experienced real estate professionals to navigate this market effectively.";
  }
}