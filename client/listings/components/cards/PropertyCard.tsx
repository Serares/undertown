import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Features } from './Features';
import { ICardProperty } from '../../../../src/interfaces/ICardProperty';
import { EPropertyTypes } from "../../../../src/interfaces/EPropertyTypes";


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
    padding: 10,
    position: "relative"
  },
  media: {
    width: "100%",
    height: "100%"
  },
  cardButtons: {
    position: "absolute",
    bottom: "0"
  }
});

type PropetyCardProps = {
  propertyValues: ICardProperty
}


export const PropertyCard: React.FunctionComponent<PropetyCardProps> = ({ propertyValues }) => {
  const classes = useStyles();
  const { thumbnail, title, address, propertyType } = propertyValues;

  let features: any = {
    surface: propertyValues.surface,
    price: propertyValues.price
  };

  if (
    propertyValues.propertyType === EPropertyTypes.HOUSE ||
    propertyValues.propertyType === EPropertyTypes.APARTMENT
  ) {
    features.rooms = propertyValues.rooms
  };

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

          <span className="my-3 d-block">
            <i className="fas fa-map-marker-alt"></i>
            <Typography variant="body2" color="textPrimary" component="span"> {address} </Typography>
          </span>

          <div>
            <Features features={features} />
          </div>
          <CardActions className={classes.cardButtons}>
            <Button size="small" color="primary">
              Share
          </Button>
            <Button size="small" color="primary">
              Detalii
          </Button>
          </CardActions>
        </div>

      </Card>
    </Grid >
  )

}