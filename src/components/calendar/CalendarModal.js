import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModaL } from '../../actions/ui';
import { eventAddNew, eventClearActiveNote, eventUpdate } from '../../actions/events';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1,'hours');
const nowPlus1 = now.clone().add(1,'hours');

const initEvent = {
    title: '',
    notes:'',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

  const dispatch = useDispatch();

  const { modalOpen } = useSelector( state => state.ui );
  const { activeEvent } = useSelector( state => state.calendar );

  const [titleValid, setTitleValid] = useState( true );
  const [dateStart, setDateStart] = useState( now.toDate() );
  const [dateEnd, setDateEnd] = useState( nowPlus1.toDate() );

  const [formValues, setFormValues] = useState( initEvent );

  const { title, notes, start, end } = formValues;

  useEffect(() => {
    if( activeEvent ){
        setFormValues( activeEvent );
    }else{
        setFormValues( initEvent );
    }
  }, [ activeEvent, setFormValues ])
  

  const handleInputchange = ( { target } ) => {
    setFormValues({
        ...formValues,[target.name]:target.value
    });
  }

  const closeModal = () => {
      dispatch( uiCloseModaL() );
      dispatch( eventClearActiveNote() );
      setFormValues( initEvent );
  }

  const handleStartDateChange = ( e ) => {
      setDateStart( e );
      setFormValues({
          ...formValues, start: e
      });
  }

  const handleEndDateChange = ( e ) => {
      setDateEnd( e );
      setFormValues({
          ...formValues, end: e
      });
  }

  const handleSubmitForm = ( e ) => {
    e.preventDefault();

    const momentStart = moment( start );
    const momentEnd = moment( end );

    if( momentStart.isSameOrAfter( momentEnd ) ){
        return Swal.fire('Error','The end date should must be greater that start date.','error');
    }
    if( title.trim().length < 2 ){
        setTitleValid( false );
    }
    setTitleValid(true);

    if( activeEvent ){
        dispatch( eventUpdate( formValues ) );
    }else{
        dispatch( eventAddNew( {
            ...formValues, id: new Date().getTime(), user:{
                id: '123',
                name: 'Bimbo'
            }
        } ) );
    }
    closeModal();
  }

  return (
    <Modal
        isOpen={ modalOpen }
        //onAfterOpen={afterOpenModal}
        onRequestClose={ closeModal }
        closeTimeoutMS={ 200 }
        style={ customStyles }
        className="modal"
        overlayClassName="modal-fondo"
    >
        <h1> { ( activeEvent )? 'Edit Event' : 'New Event' } </h1>
        <hr />
        <form 
            className="container"
            onSubmit={ handleSubmitForm }
        >
            <div className="form-group">
                <label>Start date and time</label>
                <DateTimePicker 
                    onChange={ handleStartDateChange } 
                    value={ dateStart } 
                    className="form-control" 
                />
            </div>
            <div className="form-group">
                <label>End date and time</label>
                <DateTimePicker 
                    onChange={ handleEndDateChange }
                    minDate={ dateStart } 
                    value={ dateEnd } 
                    className="form-control" 
                />
            </div>
            <hr />
            <div className="form-group">
                <label>Title and notes</label>
                <input 
                    type="text" 
                    className={`form-control ${ !titleValid && 'is-invalid' } `}
                    placeholder="Title event"
                    name="title"
                    autoComplete="off"
                    value={ title }
                    onChange={ handleInputchange }
                />
                <small id="emailHelp" className="form-text text-muted">A short description</small>
            </div>
            <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notes"
                    rows="5"
                    name="notes"
                    value={ notes }
                    onChange={ handleInputchange }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Additional Information</small>
            </div>
            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
            <i className="far fa-save"></i>
            <span> Save</span>
            </button>
        </form>
    </Modal>
  )
}
