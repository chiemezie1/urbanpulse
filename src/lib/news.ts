export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: {
    name: string
  }
  publishedAt: string
  content: string
}

export async function getLocalNews(
  location = "New York",
  page = 1,
  pageSize = 5,
): Promise<{ articles: NewsArticle[]; totalResults: number }> {
  if (!process.env.NEWS_API_KEY) {
    console.warn("News API key not found, using fallback data")
    return getFallbackNews(location)
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        location,
      )}&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`,
      { next: { revalidate: 3600 } }, // Revalidate every hour
    )

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Map the response to our interface
    const articles = data.articles.map((article: any, index: number) => ({
      id: `${index}-${article.publishedAt}`,
      title: article.title,
      description: article.description || "No description available",
      url: article.url,
      urlToImage: article.urlToImage,
      source: {
        name: article.source.name || "Unknown Source",
      },
      publishedAt: article.publishedAt,
      content: article.content || "No content available",
    }))

    return {
      articles,
      totalResults: data.totalResults,
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    return getFallbackNews(location)
  }
}

function getFallbackNews(location: string): { articles: NewsArticle[]; totalResults: number } {
  // Generate some fallback news based on the location
  return {
    articles: [
      {
        id: "1",
        title: `Local Community Center Opens in ${location}`,
        description: `A new community center has opened its doors in ${location}, offering various programs for residents of all ages.`,
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=300&text=Community+Center",
        source: {
          name: "Local News Network",
        },
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        content: `The new community center in ${location} features a gymnasium, art studio, and meeting rooms. "We're excited to provide this space for our community," says the center director.`,
      },
      {
        id: "2",
        title: `${location} Farmers Market Expands with New Vendors`,
        description: `The popular farmers market in ${location} is growing with the addition of 10 new local vendors this season.`,
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=300&text=Farmers+Market",
        source: {
          name: "City Gazette",
        },
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        content: `Visitors to the ${location} Farmers Market will now have even more options with new vendors offering artisanal cheeses, organic produce, and handcrafted goods.`,
      },
      {
        id: "3",
        title: `Transportation Improvements Planned for ${location}`,
        description: `City officials have announced a new initiative to improve public transportation in ${location} over the next year.`,
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=300&text=Transportation",
        source: {
          name: "Urban Development News",
        },
        publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        content: `The transportation improvement plan for ${location} includes expanded bus routes, bike lanes, and pedestrian-friendly infrastructure changes.`,
      },
      {
        id: "4",
        title: `${location} Schools Receive Technology Grant`,
        description: `Local schools in ${location} have been awarded a $2 million grant to enhance technology in classrooms.`,
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=300&text=Education+Technology",
        source: {
          name: "Education Daily",
        },
        publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        content: `The technology grant will provide new computers, tablets, and smart boards for schools throughout ${location}, benefiting thousands of students.`,
      },
      {
        id: "5",
        title: `New Park Development Breaks Ground in ${location}`,
        description: `Construction has begun on a new public park in ${location} that will feature recreational facilities and green spaces.`,
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=300&text=Park+Development",
        source: {
          name: "Parks & Recreation News",
        },
        publishedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        content: `The new park in ${location} will include walking trails, playgrounds, and a community garden. The project is expected to be completed within 18 months.`,
      },
    ],
    totalResults: 5,
  }
}
