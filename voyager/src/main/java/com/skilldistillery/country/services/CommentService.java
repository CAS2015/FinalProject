package com.skilldistillery.country.services;

import java.util.List;

import com.skilldistillery.country.entities.Comment;

public interface CommentService {

    public List<Comment> index(String username);

    public Comment show(String username, int cid);

    public Comment create(String username, Comment comment);

    public Comment update(String username, int cid, Comment comment);

    public boolean destroy(String username, int cid);

}