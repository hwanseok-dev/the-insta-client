import React, {Component} from "react";
import Modal from "./components/ModalTodo";
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            activeItem: {
                title: "",
                description: "",
                completed: false
            },
            activeOwner: {
                id: 1,
                name: "default name",
                join_date: "default_date"
            },
            modalItem : false,
            modalOwner : false,
            todoList: [],
            ownerList: [],
        };
    }

    componentDidMount() {
        this.refreshItemList();
        this.refreshOwnerList();
    }
    /**
     * todoList와 ownerList 모두 새롭게 갱신
     */
    refreshItemList = () => {
        axios
            .get("/api/todos/")
            .then(res => this.setState({todoList: res.data}))
            .catch(err => console.log(err));
    };
    refreshOwnerList = () => {
        axios
            .get("/api/owners/")
            .then(res => this.setState({ownerList: res.data}))
            .catch(err => console.log(err));
    };
    /**
     * todoList 중 completed와 Incompleted 중 어떤 것을 보여줄지 설정
     */
    displayCompleted = status => {
        if (status) {
            return this.setState({viewCompleted: true});
        }
        return this.setState({viewCompleted: false});
    };
    /**
     * complete/Incomplete 버튼 출력
     */
    renderTabList = () => {
        return (
            <div className="my-5 tab-list">
            <span
                onClick={() => this.displayCompleted(true)}
                className={this.state.viewCompleted ? "active" : ""}
            >
                complete
            </span>
                <span
                    onClick={() => this.displayCompleted(false)}
                    className={this.state.viewCompleted ? "" : "active"}
                >
                Incomplete
            </span>
            </div>
        );
    };
    /**
     * todoList 중 completed 또는 Incompleted만 filter해서 <li>로 나열
     * */
    renderItems = () => {
        const {viewCompleted} = this.state;
        const newItems = this.state.todoList.filter(
            item => item.completed === viewCompleted
        );
        return newItems.map(item => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
            <span
                className={`todo-title mr-2 ${
                    this.state.viewCompleted ? "completed-todo" : ""
                }`}
                title={item.description}
            >
              {item.title}
            </span>
                <span>
              <button
                  onClick={() => this.editItem(item)}
                  className="btn btn-secondary mr-2"
              >
                {" "}
                  Edit{" "}
              </button>
              <button
                  onClick={() => this.handleDelete(item)}
                  className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </span>
            </li>
        ));
    };
    /**
     * todoList 중 completed 또는 Incompleted만 filter해서 <li>로 나열
     * */
    renderOwners = () => {
        return this.state.ownerList.map(item => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
            <span
                className={`todo-title mr-2 ${
                    this.state.viewCompleted ? "completed-todo" : ""
                }`}
                title={item.join_date}
            >
              {item.name}
            </span>
                <span>
              <button
                  onClick={() => this.editItem(item)}
                  className="btn btn-secondary mr-2"
              >
                {" "}
                  Edit{" "}
              </button>
              <button
                  onClick={() => this.handleDelete(item)}
                  className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </span>
            </li>
        ));
    };
    toggleItem = () => {
        this.setState({modalItem: !this.state.modalItem});
    };
    toggleOwner = () => {
        this.setState({modalOwner: !this.state.modalOwner});
    };
    handleSubmitItem = item => {
        this.toggleItem();
        if (item.id) {
            axios
                .put(`http://localhost:8000/api/todos/${item.id}/`, item)
                .then(res => this.refreshItemList());
            return;
        }
        axios
            .post("http://localhost:8000/api/todos/", item)
            .then(res => this.refreshItemList());
    };
    handleSubmitOwner = item => {
        this.toggleOwner();
        if (item.id) {
            axios
                .put(`http://localhost:8000/api/owners/${item.id}/`, item)
                .then(res => this.refreshOwnerList());
            return;
        }
        axios
            .post("http://localhost:8000/api/owners/", item)
            .then(res => this.refreshOwnerList());
    };
    handleDelete = item => {
        axios
            .delete(`http://localhost:8000/api/todos/${item.id}/`)
            .then(res => this.refreshItemList());
    };
    createItem = () => {
        const item = {title: "", description: "", completed: false};
        this.setState({activeItem: item, modalItem: !this.state.modalItem});
    };
    createOwner = () => {
        const owner = {id:1, name: "", join_date: ""};
        this.setState({activeOwner: owner, modalOwner: !this.state.modalOwner});
    };
    editItem = item => {
        this.setState({activeItem: item, modalItem: !this.state.modalItem});
    };

    render() {
        return (
            <main className="content">
                <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
                {/* todoList Card */}
                <div className="row ">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="">
                                <button onClick={this.createItem} className="btn btn-primary">
                                    Add task
                                </button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Owner Card */}
                <div className="row ">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="">
                                <button onClick={this.createOwner} className="btn btn-primary">
                                    Add Owner
                                </button>
                            </div>
                            <ul className="list-group list-group-flush">
                                {this.renderOwners()}
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.modalItem ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggleItem}
                        onSave={this.handleSubmitItem}
                    />
                ) : null}
                {this.state.modalOwner ? (
                    <Modal
                        activeItem={this.state.activeOwner}
                        toggle={this.toggleOwner}
                        onSave={this.handleSubmitOwner}
                    />
                ) : null}
            </main>
        );
    }
}

export default App;