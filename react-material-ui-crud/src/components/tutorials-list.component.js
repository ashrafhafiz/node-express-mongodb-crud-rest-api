import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";

import { styles } from "../css-common";
import {
  TextField,
  Button,
  Grid,
  ListItem,
  withStyles,
} from "@material-ui/core";

class TutorialsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

    this.state = {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      searchTitle: "",
      page: 1,
      count: 0,
      pageSize: 3,
    };
    this.pageSizes = [3, 6, 9];
  }

  componentDidMount() {
    this.retrieveTutorials();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;
    this.setState({
      searchTitle: searchTitle,
    });
  }

  getRequestParams(searchTitle, page, pageSize) {
    let params = {};
    if (searchTitle) {
      params["title"] = searchTitle;
    }
    if (page) {
      params["page"] = page - 1;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    return params;
  }

  retrieveTutorials() {
    const { searchTitle, page, pageSize } = this.state;
    const params = this.getRequestParams(searchTitle, page, pageSize);
    TutorialDataService.getAll(params)
      .then((response) => {
        const { tutorials, totalPages } = response.data;
        this.setState({
          tutorials: tutorials,
          count: totalPages,
          searchTitle: searchTitle,
        });
        console.log("getting all data: ", response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  handlePageChange(event, value) {
    this.setState({ page: value }, () => {
      this.retrieveTutorials();
    });
  }

  handlePageSizeChange(event) {
    this.setState({ pageSize: event.target.value, page: 1 }, () => {
      this.retrieveTutorials();
    });
  }

  refreshList() {
    this.retrieveTutorials();
    this.setState({
      currentTutorial: null,
      currentIndex: -1,
    });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index,
    });
  }

  removeAllTutorials() {
    TutorialDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchTitle() {
    TutorialDataService.findByTitle(this.state.searchTitle)
      .then((response) => {
        this.setState({
          tutorials: response.data.tutorials,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props;
    const {
      searchTitle,
      tutorials,
      currentTutorial,
      currentIndex,
      page,
      count,
      pageSize,
    } = this.state;

    return (
      <div className={classes.form}>
        <Grid container>
          <Grid
            className={classes.search}
            item
            sm={12}
            xs={12}
            md={12}
            xl={12}
            lg={12}
          >
            <TextField
              label="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <Button
              size="small"
              variant="outlined"
              className={classes.textField}
              onClick={this.searchTitle}
            >
              Search
            </Button>
          </Grid>
          <Grid item md={4}>
            <h2>Tutorials List</h2>
            <Grid item>
              {"Items per Page: "}
              <select onChange={this.handlePageSizeChange} value={pageSize}>
                {this.pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <Pagination
                style={{ marginTop: "15px", marginBottom: "15px" }}
                count={count}
                page={page}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={this.handlePageChange}
              />
            </Grid>
            <div className="list-group">
              {tutorials &&
                tutorials.map((tutorial, index) => {
                  return (
                    <ListItem
                      selected={index === currentIndex}
                      onClick={() => this.setActiveTutorial(tutorial, index)}
                      divider
                      button
                      key={index}
                    >
                      {tutorial.title}
                    </ListItem>
                  );
                })}
            </div>

            <Button
              className={`${classes.button} ${classes.removeAll}`}
              size="small"
              color="secondary"
              variant="contained"
              onClick={this.removeAllTutorials}
            >
              Remove All
            </Button>
          </Grid>
          <Grid item md={8}>
            {currentTutorial ? (
              <div className={classes.tutorial}>
                <h4>Tutorial</h4>
                <div className={classes.detail}>
                  <label>
                    <strong>Title:</strong>
                  </label>{" "}
                  {currentTutorial.title}
                </div>
                <div className={classes.detail}>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {currentTutorial.description}
                </div>
                <div className={classes.detail}>
                  <label>
                    <strong>Status:</strong>
                  </label>{" "}
                  {currentTutorial.published ? "Published" : "Pending"}
                </div>

                <Link
                  to={"/tutorials/" + currentTutorial.id}
                  className={classes.edit}
                >
                  Edit
                </Link>
              </div>
            ) : (
              <div>
                <br />
                <p className={classes.tutorial}>
                  Please click on a Tutorial...
                </p>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TutorialsList);
