/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        alignItems: 'center',
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div
        style={{
          display: `flex`,
          flexDirection: 'column'
        }}
      >
        <div>
          Shower thoughts on Software by <strong>{author.name}</strong>
        </div>
        <div>
          <a href={`https://twitter.com/atomkirk`}>
            Twitter
          </a>
          <a href={'https://github.com/atomkirk'} style={{marginLeft: 5}}>
            Github
          </a>
          <a href={'http://stackoverflow.com/users/798055/atomkirk'} style={{marginLeft: 5}}>
            Stack Overflow
          </a>
          <a href={'https://www.linkedin.com/in/atomkirk/'} style={{marginLeft: 5}}>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}

export default Bio
