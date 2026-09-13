// ============================
// GraphQL Queries for SarayeSang
// ============================

// ---------- محصولات ----------

export const GET_PRODUCT_BY_SLUG = `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      shortDescription
      sku
      price
      regularPrice
      salePrice
      onSale
      averageRating
      reviewCount
      image {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      attributes {
        nodes {
          id
          name
          options
        }
      }
      acf {
        productCode
        stoneType
        dimensions
        weight
        surfaceFinish
        colorFamily
        application
        imageGallery {
          sourceUrl
          altText
        }
      }
    }
  }
`

export const GET_PRODUCTS = `
  query GetProducts($first: Int!, $after: String, $category: String) {
    products(
      first: $first
      after: $after
      where: {
        category: $category
        orderby: {
          field: DATE
          order: DESC
        }
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
        total
      }
      nodes {
        id
        name
        slug
        price
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`

export const GET_ALL_PRODUCT_SLUGS = `
  query GetAllProductSlugs($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
      }
    }
  }
`

export const SEARCH_PRODUCTS = `
  query SearchProducts($search: String!, $first: Int = 10) {
    products(
      first: $first
      where: {
        search: $search
      }
    ) {
      nodes {
        id
        name
        slug
        price
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`

// ---------- دسته‌بندی محصولات ----------

export const GET_PRODUCT_CATEGORIES = `
  query GetProductCategories {
    productCategories(first: 100) {
      nodes {
        id
        name
        slug
        count
        description
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`

export const GET_PRODUCT_CATEGORY_BY_SLUG = `
  query GetProductCategoryBySlug($slug: ID!) {
    productCategory(
      id: $slug
      idType: SLUG
    ) {
      id
      name
      slug
      description
      count
      image {
        sourceUrl
        altText
      }
    }
  }
`

// ---------- بلاگ ----------

export const GET_POSTS = `
  query GetPosts($first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: {
        orderby: {
          field: DATE
          order: DESC
        }
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }

      nodes {
        id
        title
        slug
        uri
        excerpt
        date

        featuredImage {
          node {
            sourceUrl
            altText
          }
        }

        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(
      id: $slug
      idType: SLUG
    ) {
      id
      databaseId
      title
      slug
      uri
      date
      modified
      excerpt
      content

      featuredImage {
        node {
          sourceUrl
          altText

          mediaDetails {
            width
            height
          }
        }
      }

      categories {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`

export const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs(
    $first: Int!
    $after: String
  ) {
    posts(
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }

      nodes {
        slug
      }
    }
  }
`

// ---------- صفحه اصلی ----------

export const GET_HOME_PAGE_DATA = `
  query GetHomePageData {
    featuredProducts: products(
      first: 8
      where: {
        featured: true
      }
    ) {
      nodes {
        id
        name
        slug
        price
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }

    recentProducts: products(
      first: 8
      where: {
        orderby: {
          field: DATE
          order: DESC
        }
      }
    ) {
      nodes {
        id
        name
        slug
        price
        image {
          sourceUrl
          altText
        }
      }
    }

    productCategories(first: 10) {
      nodes {
        id
        name
        slug
        count
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`