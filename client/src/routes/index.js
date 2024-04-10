const UserRouter = require('./UserRouter')
const FacultyRouter = require('./FacultyRouter')
const EventRouter = require('./EventRouter')
const ContributionRouter = require('./ContributionRouter')
const NotificationRouter = require('./NotificationRouter')
const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/faculty', FacultyRouter)
    app.use('/api/event', EventRouter)
    app.use('/api/contribution', ContributionRouter)
    app.use('/api/notification', NotificationRouter)
}

module.exports = routes;