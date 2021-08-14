import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';

import { createHaircut, deleteHaircut, getHaircuts, patchHaircut } from '../api/haircuts-api'
import Auth from '../auth/Auth'
import { Haircut } from '../types/Haircut'

interface HaircutProps {
  auth: Auth
  history: History
}

interface HaircutState {
  haircuts: Haircut[]
  newHaircutName: string
  newHaircutDescription: string
  newAppointmentDate: string
  loadingHaircuts: boolean
}

export class Haircuts extends React.PureComponent<HaircutProps, HaircutState> {
  state: HaircutState = {
    haircuts: [],
    newHaircutName: '',
    newHaircutDescription: '',
    newAppointmentDate: '',
    loadingHaircuts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newHaircutName: event.target.value })
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAppointmentDate: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newHaircutDescription: event.target.value })
  }

  onEditButtonClick = (haircutId: string) => {
    this.props.history.push(`/haircuts/${haircutId}/edit`)
  }

  onHaircutCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      // const appointmentDate = this.calculateAppointmentDate()
      const newHaircut = await createHaircut(this.props.auth.getIdToken(), {
        name: this.state.newHaircutName,
        description: this.state.newHaircutDescription,
        appointmentDate: this.state.newAppointmentDate
      })
      this.setState({
        haircuts: [...this.state.haircuts, newHaircut],
        newHaircutName: '',
        newHaircutDescription: '',
        newAppointmentDate: ''
      })
    } catch {
      alert('Faile to create haircut appointment')
    }
  }

  onHaircutDelete = async (haircutId: string) => {
    try {
      await deleteHaircut(this.props.auth.getIdToken(), haircutId)
      this.setState({
        haircuts: this.state.haircuts.filter(haircut => haircut.haircutId != haircutId)
      })
    } catch {
      alert('Failed to delete haircut appointment')
    }
  }

  async componentDidMount() {
    try {
      const haircuts = await getHaircuts(this.props.auth.getIdToken())
      this.setState({
        haircuts,
        loadingHaircuts: false
      })
    } catch (e) {
      alert(`Failed to fetch haircut appointments: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Haircut Appointments</Header>

        {this.renderCreateHaircutInput()}

        {this.renderHaircuts()}
      </div>
    )
  }

  renderCreateHaircutInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            placeholder="Name"
            onChange={this.handleNameChange}
          />
          <Input
            placeholder="Date (2021-08-14)"
            onChange={this.handleDateChange}
          />
          <Input
            action={{
              color: 'teal',
              labelPosition: 'right',
              icon: 'add',
              content: 'Book Appointment',
              onClick: this.onHaircutCreate
            }}
            placeholder="Description (Buzz cut...)"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderHaircuts() {
    if (this.state.loadingHaircuts) {
      return this.renderLoading()
    }

    return this.renderHaircutsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Haircut Appointments
        </Loader>
      </Grid.Row>
    )
  }

  renderHaircutsList() {
    return (
      <Grid padded>
        <Grid.Row key="Main">
              <Grid.Column width={3} verticalAlign="middle">
                Name
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                Date
              </Grid.Column>
              <Grid.Column width={8} floated="right">
                Description
              </Grid.Column>
              <Grid.Column width={1} floated="right">

              </Grid.Column>
              <Grid.Column width={1} floated="right">

              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
        {this.state.haircuts.map((haircut, pos) => {
          return (
            <Grid.Row key={haircut.haircutId}>
              <Grid.Column width={3} verticalAlign="middle">
                {haircut.description}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {haircut.appointmentDate}
              </Grid.Column>
              <Grid.Column width={8} verticalAlign="middle">
                {haircut.name}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(haircut.haircutId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onHaircutDelete(haircut.haircutId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {haircut.attachmentUrl && (
                <Image src={haircut.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateAppointmentDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
