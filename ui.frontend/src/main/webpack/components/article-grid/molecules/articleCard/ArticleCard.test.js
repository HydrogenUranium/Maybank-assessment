import React from 'react';
import { create } from 'react-test-renderer';
import { ArticleCard } from './ArticleCard';

describe('ArticleCard', () => {
  it('should render component "ArticleCard" property', () => {
    const component = create(
      <ArticleCard
        article={{
          createdfriendly: "April 20, 2023",
          groupTag: "#LogisticsAdvice",
          title: "What is Reverse Logistics?",
          description: "Discover everything you need to know about reverse logistics including types, benefits, challenges, and strategies to optimize your reverse logistics practices.",
          author: "Anna Thompson",
          listimage: "/discover/content/dam/global-master/4-logistics-advice/essential-guides/wec0787-what-is-reverse-logistics/Mobile_991x558_V02.jpg",
          tagsToShow: [],
          path: "/discover/en-global/logistics-advice/essential-guides/what-is-reverse-logistics"
        }}

      />
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
