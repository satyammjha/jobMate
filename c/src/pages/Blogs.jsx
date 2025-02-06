import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

const BlogDetails = ({ blog }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <CardHeader>
                    <img src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
                </CardHeader>
                <CardContent className="p-6">
                    <CardTitle className="text-3xl font-bold mb-4">{blog.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-700">
                        {blog.description}
                    </CardDescription>
                </CardContent>
                <CardFooter className="p-6">
                    <div className="flex flex-wrap gap-2">
                        {blog.referenceLinks.map((link, index) => (
                            <Button key={index} asChild variant="outline">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm"
                                >
                                    {link.text}
                                </a>
                            </Button>
                        ))}
                    </div>
                </CardFooter>
            </div>
        </div>
    );
};

export default BlogDetails;