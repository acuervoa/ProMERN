/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

class IssueFilter extends React.Component {
  render() {
    return <div>This is a placeholder for the issue filter.</div>;
  }
}

function IssueTable(props) {
  const issueRows = props.issues.map((issue) => (
    <IssueRow key={issue.id} issue={issue} />
  ));

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

function IssueRow(props) {
  const { issue } = props;

  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ' '}</td>
      <td>{issue.title}</td>
    </tr>
  );
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    this.props.createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    return (
      <form name="issueAdd" onSubmit={this.handleSubmit}>
        <input type="text" name="owner" placeholder="Owner" />
        <input type="text" name="title" placeholder="Title" />
        <button>Add</button>
      </form>
    );
  }
}


function graphQLFetch(query, variables = {}) {
  return fetch(window.ENV.UI_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.text())
    .then((body) => JSON.parse(body, jsonDateReviver))
    .then((result) => {
      if (result.errors) {
        const error = result.errors[0];
        if (error.extension.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`BAD ${error.message}:\n ${details}`);
        } else {
          alert(`NOT BAD ${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    })
    .catch((e) => alert(`CATCH Error in sending data to server: ${e.message}`));
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const query = `query {
        issueList {
            id title status owner
            created effort due
        }
    }`;

    graphQLFetch(query).then((data) => {
      if (data) {
        this.setState({ issues: data.issueList });
      }
    });
  }

  createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
          issueAdd(issue: $issue) {
              id
          }
      }`;

    graphQLFetch(query, { issue }).then((data) => {
      if (data) {
        this.loadData();
      }
    });
  }

  render() {
    return (
      <>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </>
    );
  }
}

const element = <IssueList />;

ReactDOM.render(element, document.getElementById('content'));
