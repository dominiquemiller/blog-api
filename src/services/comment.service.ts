import { default as Comment, CommentModel } from "../models/comment.model";
import { default as Post } from "../models/post.model";
import * as mongoose from "mongoose";


export class CommentService {
  postId: mongoose.Schema.Types.ObjectId;
  body: string;
  email: string;
  commentId: mongoose.Schema.Types.ObjectId;

  constructor( comment: CommentModel ) {
    this.postId = comment.post_id;
    this.body = comment.body;
    this.email = comment.email;
  }

  createComment() {

    new Promise( async (res, rej ) => {
      const comment = await Comment.create( { body: this.body, email: this.email },
        (err: any, doc: mongoose.Document ) => {
          console.log("createComment", err, doc);
          if (err) rej(err);
          return doc;
      });

      try {
        const updated = await this.updatePostId(comment.id);
        res(updated);
      } catch (error) {
        rej(error);
      }
    });

  }

  private updatePostId(id: mongoose.Schema.Types.ObjectId) {
    return new Promise<mongoose.Query<any>>((res, rej) => {
      Post.update({ _id: this.postId },
                  { $push: { comments: id } },
                    (err, success) => {
                      console.log("update", err, success)
                      if (err) rej(err);
                      res(success);
                    } );

    });
  }

}
