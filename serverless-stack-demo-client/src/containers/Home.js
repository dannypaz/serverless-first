import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  FormControl,
  FormGroup,
  InputGroup,
  Alert
} from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import LoaderButton from "../components/LoaderButton";
import "./Home.css";


export default function Home() {
  const [fields, handleFieldChange, clearFields] = useFormFields({
    search: "",
    replace: ""
  });
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isReplace, setIsReplace] = useState(false);
  const [replaceIsSuccessful, setReplaceSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function searchFilter(note) {
    return note.content.includes(fields.search)
  }

  async function handleReplace(e) {
    e.preventDefault()

    setIsLoading(true)

    const confirmed = window.confirm(
      `Are you sure you want to replace all instances of ${fields.search} with ${fields.replace}?`
    );

    if (!confirmed) {
      setIsLoading(false)
      return;
    }

    const notesToReplace = notes.filter(searchFilter)
    const replacePromises = notesToReplace.map(async (note) => {
      return API.put("notes", `/notes/${note.noteId}`, {
        body: {
          content: note.content.replace(fields.search, fields.replace),
          attachments: notes.attachments
        }
      });
    })

    try {
      await Promise.all(replacePromises)
      // reset all fields and refresh notes
      setNotes(await loadNotes())
      setIsReplace(false)
      setReplaceSuccess(true)
      clearFields()
    } catch (e) {
      // TODO: We need to ask product how we should handle if we are not able to update
      // TODO: can we create a batch api to allow us to update records atomically?
      // maybe we need to save old records to rollback or forget it?
      console.error(e)
      setIsError(true)
    }

    setIsLoading(false)
  }

  function renderNotesList(notes) {
    const actions = [
      <LinkContainer key="new" to="/notes/new">
        <ListGroupItem>
          <h4>
            <b>{"\uFF0B"}</b> Create a new note
          </h4>
        </ListGroupItem>
      </LinkContainer>
    ]

    if (isLoading) {
      // Instead of using Array(3).fill, I did a fancy concat so that we are able to
      // add the `key` property to the elements and prevent warnings in the dev
      // console
      return actions.concat([1,2,3].map(num => (
        <ListGroupItem key={`skeleton-${num}`} header={<Skeleton width={100} />}>
          <Skeleton count={2} />
        </ListGroupItem>
      )))
    }

    if (notes.length === 0) {
      return actions.concat([
        <h4 key="no-results" className="text-center">No results</h4>
      ])
    }

    const elements = notes.map((note) => (
      <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
        <ListGroupItem header={note.content.trim().split("\n")[0]}>
          {"Created: " + new Date(note.createdAt).toLocaleString()}
        </ListGroupItem>
      </LinkContainer>
    ))

    return actions.concat(elements)
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderAlert() {
    setTimeout(() => {
      setReplaceSuccess(false)
    }, 4000)

    return (
      <Alert bsStyle="success">
        <strong>Holy guacamole!</strong> Search and replace was successful.
      </Alert>
    )
  }

  function renderError() {
    return (
      <Alert bsStyle="danger">
        <strong>Womp Womp!</strong> Something happened and we weren't able to complete your request. Please try again.
      </Alert>
    )
  }

  function renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <FormGroup controlId="search">
          <FormControl
            size="lg"
            type="text"
            value={fields.search}
            placeholder="Search..."
            onChange={handleFieldChange}
            disabled={fields.search && isLoading}
          />
        </FormGroup>
        <FormGroup controlId="replace">
          <InputGroup>
            <FormControl
              type="text"
              value={fields.replace}
              placeholder="Replace..."
              onChange={handleFieldChange}
              disabled={fields.replace && isLoading}
            />
            <InputGroup.Addon>
              <span className="replace">Replace</span>
              <input
                type="checkbox"
                value={isReplace}
                checked={isReplace}
                onChange={(e) => setIsReplace(e.target.checked)}
                disabled={isLoading}
              />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup hidden={!isReplace} className="text-right">
          <LoaderButton
            type="submit"
            bsSize="small"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleReplace}
          >
            Search and Replace
          </LoaderButton>
        </FormGroup>
        <ListGroup>
          {renderNotesList(notes.filter(searchFilter))}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {replaceIsSuccessful && renderAlert()}
      {isError && renderError()}
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
