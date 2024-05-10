import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { LevelDB } from "react-native-leveldb";
import uuid from 'react-native-uuid';

const name = 'notes.db';
const createIfMissing = true;
const errorIfExists = false;

const db = new LevelDB(name, createIfMissing, errorIfExists);

export const dbApi = createApi({
  reducerPath: 'dbApi',
  tagTypes: ['Notes'],
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchNotes: build.query({
      queryFn() {
        const serializedNotes = db.getStr('notes');

        const notes = JSON.parse(serializedNotes);

        return { data: notes }
      },
      providesTags: (result) => ['Notes']
    }),
    searchNotes: build.query({
      queryFn(searchString) {
        const serializedNotes = db.getStr('notes');

        const notes = JSON.parse(serializedNotes);
        
        if (searchString == "") { 
          return { data: notes }
        } else {
          const filteredNotes = notes.filter(note => {
            const { title, content } = note;
            const s = searchString.toLowerCase();
            return title.toLowerCase().indexOf(s) !== -1 || content.toLowerCase().indexOf(s) !== -1;
          });

          return { data: filteredNotes || [] }
        }
      }, 
      providesTags: (result) => ['Notes']
    }),
    addNote: build.mutation({
      queryFn(note) {
        const serializedNotes = db.getStr('notes');
        const notes = JSON.parse(serializedNotes) || [];
        note.id = uuid.v4();
        notes.unshift(note);
        db.put('notes', JSON.stringify(notes));
        return { data: note }
      },
      invalidatesTags: ['Notes'],
    }),
    deleteNote: build.mutation({
      queryFn(note) {
        const serializedNotes = db.getStr('notes');
        var notes = JSON.parse(serializedNotes) || [];
        notes = notes.filter(x => x.id !== note.id);
        db.put('notes', JSON.stringify(notes));
        return { data: note };
      },
      invalidatesTags: ['Notes'],
    }),
    updateNote: build.mutation({
      queryFn(note) {
        const serializedNotes = db.getStr('notes');
        const notes = JSON.parse(serializedNotes) || [];
        const updatedNotes = notes.map((n) => {
          if (n.id === note.id) {
            return { ...n, title: note.title, content: note.content };
          }
          return n;
        });
        db.put('notes', JSON.stringify(updatedNotes));
        return { data: note }
      },
      invalidatesTags: ['Notes'],
    }),
  }),
})

export const { useFetchNotesQuery, useSearchNotesQuery, useAddNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = dbApi