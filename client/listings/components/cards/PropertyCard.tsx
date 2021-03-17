import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    display: "flex"
  },
  actionArea: {
    width: 500,
    height: 300
  },
  details: {
    display: 'flex',
    flexDirection: "column",
    width: "100%",
    padding: 10
  },
  media: {
    width: "100%",
    height: "100%"
  },
});

//@ts-ignore
export const PropertyCard = ({ title, address, thumbnail }) => {
  const classes = useStyles();

  return (
    <Grid item md={12} sm={12}>
      <Card className={classes.root}>
        <CardActionArea className={classes.actionArea}>
          <CardMedia
            className={classes.media}
            image={thumbnail}
            title="Imagine"
          />
        </CardActionArea>

        <div className={classes.details}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <span className="my-3 d-block">
              <i className="fas fa-map-marker-alt"></i>
              {address}
            </span>
          </Typography>
          <CardActions>
            <Button size="small" color="primary">
              Share
          </Button>
            <Button size="small" color="primary">
              Learn More
          </Button>
          </CardActions>
        </div>

      </Card>
    </Grid>
  )

}